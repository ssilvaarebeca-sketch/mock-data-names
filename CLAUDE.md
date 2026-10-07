# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a minimal Python project for working with `MOCK_DATA.csv`, a 1000-row synthetic dataset with columns `id, first_name, last_name, email, gender, ip_address`.

## Running

```bash
python3 show_names.py
```

`show_names.py` reads `MOCK_DATA.csv` via `csv.DictReader` and prints each row's `first_name` and `last_name`. Use `--csv` to point it at a different file. Tests live in `tests/` (`python3 -m unittest discover`).

## Web app

`webapp/` is a static, client-side single-page app (no backend, no build step) for dropping in any membership-style CSV and choosing which columns to display as a table. Open `webapp/index.html` directly, or serve the directory (e.g. `python3 -m http.server`) and visit it in a browser. CSV parsing lives in `webapp/csv-utils.js`, with tests in `webapp/csv-utils.test.js` (`node webapp/csv-utils.test.js`).
