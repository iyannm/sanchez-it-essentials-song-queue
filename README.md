# Sanchez IT Essentials Class Song Queue

Students request school-safe songs; the teacher reviews them and queues them on Spotify.

- **Student page:** `index.html`: search, request (share by link or QR code)
- **Teacher page:** `teacher.html`: see requests, open them in Spotify, mark queued/rejected, show the QR code

## How songs are filtered

1. Song search uses the Apple Music/iTunes catalog. Any track Apple marks **explicit** is blocked.
2. Titles, artists and albums are checked against word lists for profanity, drugs/alcohol and violence (`filter.js`).
3. Some well-known songs with harmless-looking titles are blocked by name (`knownSongs` in `filter.js`).
4. Lyrics are looked up on lrclib.net and scanned with the same lists. School web filters often block
   lyric sites. When that happens the request still goes through, and the teacher page labels it
   **Lyrics not checked** so you know to review it.

No filter is perfect. The teacher's review is the final check.

## How requests get to the teacher

Requests are sent through [ntfy.sh](https://ntfy.sh), a free message relay that needs no account. It keeps
messages for about 12 hours. The teacher page saves everything it receives in that browser, so open it at
least once a school day. The topic name is in `config.js`; change it to start a fresh queue.

## Settings

Edit `config.js` to change the per-student request limit.
