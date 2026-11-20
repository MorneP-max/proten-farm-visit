# ProTen Farm Visit

A phone app (web app) for broiler farm visits. Fill in the farm, sheds, checklists, actions and photos,
then tap **Finish & create PDF** to send the ProTen PDF report from your iPhone's Mail.
If the farm has a TickOff key, the visit's actions also go to that farm's TickOff group.

## Where things are saved
- **Visits:** only on the phone that made them (the app's own storage). Use **Export backup** on the
  Visits page regularly and keep the file in Files, OneDrive or your email.
- **TickOff keys:** only on the phone, one per farm. They are never in this code, the reports or the backups.
- **This repository:** only the app itself. No farm data, no keys.

## Privacy & security
- **Photos and visits never leave the phone** unless you send the PDF or save a backup. They are not in this repository.
- **Photo location removed:** when a photo is added, it is redrawn and resized, which strips its GPS location and camera details.
- **Locked-down app:** a Content Security Policy in `index.html` lets the app run only its own code (no outside scripts) and
  only connect to TickOff. Anything else is blocked by the phone's browser.
- **TickOff** receives only each action's text, priority, responsible person and due date – never photos, notes or checklists.
- **Backups** can be password-protected (AES-256 encryption). Without the password the file can't be read – or restored.
- **Imported backups are checked:** only known fields and real photos are accepted; anything else is dropped.
- **Keep the GitHub account safe:** whoever can change this repository can change the app. Turn on two-factor authentication.
- When you change `index.html`, rebuild it with the same tool (the security policy includes a fingerprint of the app's code).

## Files
| File | What it is |
|---|---|
| `index.html` | The whole app |
| `pdf-lib.min.js` | Makes the PDF reports ([pdf-lib](https://pdf-lib.js.org), MIT licence) |
| `sw.js` | Lets the app open with no signal |
| `manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png` | Name and icon for the Home Screen |

## Updating the app
1. Upload the new `index.html` (Add file → Upload files → Commit changes).
2. Open `sw.js`, tap the pencil, change `proten-farm-visit-v1` to the next number (`v2`, `v3`…), Commit changes.
3. On the iPhone, open the app with signal, close it fully and open it again.

## TickOff
Reports are sent to `https://xucdcvkxxlugozwpyllu.supabase.co/functions/v1/app-inbox` with the farm's key in the
`X-TickOff-Key` header. Each visit has a fixed `report_id` (`visit-<id>`), so sending again never makes doubles.
Reports wait in the app's **TickOff outbox** when there's no signal, or when TickOff says to try later.
