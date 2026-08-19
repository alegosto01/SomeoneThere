# App assets

`icon.png`, `adaptive-icon.png` and `splash.png` are **placeholders**, generated
so that `expo prebuild` and EAS builds have the files `app.json` references.
They are a plain map-pin mark in the brand green — not final artwork.

Replace all three before any store submission:

| File | Size | Notes |
| --- | --- | --- |
| `icon.png` | 1024×1024 | Opaque, no transparency, no rounded corners (the OS masks it) |
| `adaptive-icon.png` | 1024×1024 | Foreground only, transparent, art inside the centre 66% |
| `splash.png` | 1284×1284 | Sits on the `splash.backgroundColor` from `app.json` (`#FFFFFF`) |
