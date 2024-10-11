# `FROM` instructions support variables that are declared by any `ARG` instructions that occur before the first `FROM`.
ARG OPS_DISTROLESS_TAG=20220718
ARG OPS_TOOLSETS_TAG=latest

FROM build-harbor.alauda.cn/ops/toolset:${OPS_TOOLSETS_TAG} AS tools
FROM build-harbor.alauda.cn/ops/distroless-static:${OPS_DISTROLESS_TAG}
LABEL OPS_DISTROLESS_TAG="${OPS_DISTROLESS_TAG}"
LABEL OPS_TOOLSETS_TAG="${OPS_TOOLSETS_TAG}"
COPY --from=tools /lib/ /lib/

COPY --from=tools /usr/local/bin/mkdir /usr/local/bin/cp /usr/local/bin/ls \
  /usr/local/bin/sed \
  /usr/local/bin/
# 这一条命令会拷贝 /bin/bash 和 指向它的软链接 /bin/sh
COPY --from=tools /bin/ /bin/

COPY --chown=nonroot:nonroot ./dist/apps /frontend-plugins
