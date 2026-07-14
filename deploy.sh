#!/usr/bin/env bash
set -euo pipefail

APP_NAME="planlog-frontend"
BUILD_DIR=".next"

echo "[deploy] environment: ${NODE_ENV:-production}"
echo "[deploy] app: ${APP_NAME}"

npm ci
npm run build

if [ ! -d "${BUILD_DIR}" ]; then
  echo "[deploy] build output not found: ${BUILD_DIR}" >&2
  exit 1
fi

echo "[deploy] build completed"

