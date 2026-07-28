# Górski second brain

Notatki i rekomendacje sprzętowe na wyjazdy w góry.
Strona: **https://majsterkovic.github.io/gory/**

## Jak dodać notatkę

```
docs/
  index.md                  # strona główna = lista zakupowa
  <kategoria>/raport.md     # publikowane na stronie
  <kategoria>/zrodla/*.md   # NIE publikowane — deep researche, eksporty z Perplexity/Gemini
```

1. Wrzuć plik `.md` do `docs/<kategoria>/`.
2. Dopisz go do `nav:` w `mkdocs.yml` (bez tego nie pojawi się w menu).
3. `git add . && git commit -m "..." && git push` — deploy leci sam, ok. 1 minuta.

Surowe materiały źródłowe wrzucaj do `docs/<kategoria>/zrodla/` — zostają w repo,
ale nie trafiają na stronę.

## Podgląd lokalny

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
mkdocs serve          # http://127.0.0.1:8000 z auto-odświeżaniem
```

## Jak to działa

- **MkDocs Material** renderuje `.md` → statyczny HTML (wyszukiwarka, tryb ciemny, mobilna nawigacja)
- `.github/workflows/deploy.yml` buduje i publikuje przy każdym pushu na `main`
- `mkdocs.yml` → `exclude_docs` decyduje, co nie trafia na stronę
