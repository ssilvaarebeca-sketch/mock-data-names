# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a minimal Python project for working with `MOCK_DATA.csv`, a 1000-row synthetic dataset with columns `id, first_name, last_name, email, gender, ip_address`.

## Running

```bash
python3 show_names.py
```

`show_names.py` reads `MOCK_DATA.csv` via `csv.DictReader` and prints each row's `first_name` and `last_name`. It expects to be run from this directory (the CSV path is relative).
