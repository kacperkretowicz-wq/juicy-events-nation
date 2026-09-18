#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${JUICY_DEPLOY_DIR:-$ROOT/dist}"
HOST="${JUICY_FTP_HOST:-h86.seohost.pl}"
USER="${JUICY_FTP_USER:-}"
PASS="${JUICY_FTP_PASS:-${FTP_PASSWORD:-}}"
REMOTE="${JUICY_FTP_REMOTE:-/domains/juicyevents.pl/public_html/}"

if [[ ! -d "$SRC" ]]; then
  echo "Brak katalogu build: $SRC (najpierw npm run build)" >&2
  exit 1
fi

if [[ -z "$USER" || -z "$PASS" ]]; then
  echo "Ustaw JUICY_FTP_USER i JUICY_FTP_PASS (hasło FTP SEOHOST), potem uruchom ponownie." >&2
  exit 1
fi

if ! command -v lftp >/dev/null 2>&1; then
  echo "Brak lftp — zainstaluj: brew install lftp" >&2
  exit 1
fi

echo "Deploy $SRC -> $USER@$HOST:$REMOTE"

lftp -u "$USER","$PASS" "$HOST" <<EOF
set ftp:ssl-allow no
set net:timeout 30
set net:max-retries 3
mirror -R --verbose --parallel=4 --delete "$SRC" "$REMOTE"
bye
EOF

echo "Deploy SEOHOST zakończony."
