#!/bin/bash
export OPENAPI_DIR=$(dirname "$(readlink -f "$0")")

docker run --rm \
  -v "${OPENAPI_DIR}:/local" -u $(id -u):$(id -g) openapitools/openapi-generator-cli generate \
  -i /local/api.yaml \
  -g spring \
  -c /local/backend-config.yaml \
  -o /local/out/api/java

rsync -r ${OPENAPI_DIR}/out/api/java/src/ ${OPENAPI_DIR}/../src/

docker run --rm \
  -v "${OPENAPI_DIR}:/local" -u $(id -u):$(id -g) openapitools/openapi-generator-cli generate \
  -i /local/api.yaml \
  -g typescript-fetch \
  -c /local/frontend-config.yaml \
  -o /local/out/api/typescript

rsync -r ${OPENAPI_DIR}/out/api/typescript/ ${OPENAPI_DIR}/../../CvApp-frontend/src/api/client/

rm -rf "${OPENAPI_DIR}"/out/api
rm -rf "${OPENAPI_DIR}"/out