#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROTO_DIR="$PROJECT_ROOT/protos"
GO_OUT_DIR="$PROJECT_ROOT/../service/gen"
TS_OUT_DIR="$PROJECT_ROOT/../ui/mobile/src/gen"

echo "🔧 Generating protobuf code..."

# Create output directories
mkdir -p "$GO_OUT_DIR"
mkdir -p "$TS_OUT_DIR"

# Generate Go code
echo "📦 Generating Go code..."
protoc \
  --proto_path="$PROTO_DIR" \
  --go_out="$GO_OUT_DIR" \
  --go-grpc_out="$GO_OUT_DIR" \
  $(find "$PROTO_DIR" -name "*.proto")

# Generate TypeScript code
echo "📦 Generating TypeScript code..."
cd "$PROJECT_ROOT"
protoc \
  --proto_path="$PROTO_DIR" \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out="$TS_OUT_DIR" \
  --ts_proto_opt=outputServices=grpc-js,esModuleInterop=true,outputJsonMethods=false \
  $(find "$PROTO_DIR" -name "*.proto")

echo "✅ Proto generation completed!"
echo "Go types: $GO_OUT_DIR"
echo "TypeScript types: $TS_OUT_DIR"