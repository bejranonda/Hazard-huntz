// Sharing: Web Share API first (one tap), then LINE / Facebook / X / copy
// link / save image. In-app browsers on Android have no Web Share, and most
// in-app browsers cannot download files, so the card is also shown as an
// <img> that people can press and hold to save.

import { inAppBrowser, isIOS } from './util.js';
import { track } from './analytics.js';

export function challengeUrl(site, mode, score10, houseKey) {
  const m = mode === 'return' ? 'r' : 'p';
  const s = Math.max(0, Math.min(10, Math.round(score10)));
  return `${site}/c/${m}${s}?h=${encodeURIComponent(houseKey)}`;
}

// "/c/p8?h=20261006" -> { mode: 'prepare', score: 8, houseKey: '20261006' }
export function parseChallenge(loc = location) {
  const m = /^\/c\/([pr])(\d{1,2})\/?$/.exec(loc.pathname);
  if (!m) return null;
  const score = Number(m[2]);
  if (score > 10) return null;
  const houseKey = new URLSearchParams(loc.search).get('h') || '';
  return { mode: m[1] === 'r' ? 'return' : 'prepare', score, houseKey };
}

export function canNativeShare() {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export function canShareFile(file) {
  try {
    return !!(navigator.canShare && file && navigator.canShare({ files: [file] }));
  } catch {
    return false;
  }
}

// Returns 'shared' | 'cancelled' | 'unsupported'. Must run inside a tap.
export async function nativeShare({ file, title, text, url }) {
  if (!canNativeShare()) return 'unsupported';
  const withFile = file && canShareFile(file);
  const data = withFile ? { files: [file], title, text } : { title, text, url };
  // When sharing a file, iOS keeps the text, so put the URL inside it.
  if (withFile && url && !text.includes(url)) data.text = `${text}\n${url}`;
  try {
    await navigator.share(data);
    return 'shared';
  } catch (e) {
    if (e && e.name === 'AbortError') return 'cancelled';
    // Some browsers reject file shares; retry with just text + link.
    if (withFile) {
      try {
        await navigator.share({ title, text, url });
        return 'shared';
      } catch (e2) {
        return e2 && e2.name === 'AbortError' ? 'cancelled' : 'unsupported';
      }
    }
    return 'unsupported';
  }
}

export function lineShareUrl(text) {
  return `https://line.me/R/share?text=${encodeURIComponent(text)}`;
}

export function facebookShareUrl(url) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function xShareUrl(text, url) {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    ta.remove();
    if (ok) return true;
  } catch { /* fall through */ }
  window.prompt('Copy:', text);
  return false;
}

// Can this browser actually save a downloaded file?
export function canDownload() {
  return !inAppBrowser() && 'download' in HTMLAnchorElement.prototype;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// Open an outbound share link inside the current tap. In-app browsers often
// block window.open, so navigate in place there.
export function openExternal(href) {
  const app = inAppBrowser();
  if (app) {
    location.href = href;
    return;
  }
  const w = window.open(href, '_blank', 'noopener');
  if (!w) location.href = href;
}

// LINE's in-app browser can hand the page to the phone's real browser.
export function lineExternalUrl(href) {
  const u = new URL(href, location.href);
  u.searchParams.set('openExternalBrowser', '1');
  return u.toString();
}

export function shareChannel(channel, { text, url, blob, filename, mode }) {
  track('share_click', { mode, label: channel });
  if (channel === 'line') openExternal(lineShareUrl(text));
  else if (channel === 'facebook') openExternal(facebookShareUrl(url));
  else if (channel === 'x') openExternal(xShareUrl(text.replace(url, '').trim(), url));
  else if (channel === 'save' && blob) downloadBlob(blob, filename);
}

export const platformHint = () => ({ inApp: inAppBrowser(), ios: isIOS() });

// Image src for previews people may press-and-hold to save. In-app web views
// handle data: URLs more reliably than blob: URLs.
export function imageSrc(blob) {
  if (!inAppBrowser()) return Promise.resolve(URL.createObjectURL(blob));
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = () => resolve(URL.createObjectURL(blob));
    fr.readAsDataURL(blob);
  });
}
