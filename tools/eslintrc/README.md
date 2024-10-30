# eslint 基础配置

## 声明

本配置，由 @1stg/eslint-config fork 而来，fork 目的是为了后续的库升级方便，公共维护方便（eslint 中配置经常与 typescript 版本挂钩）。且当前的 eslint-config 通过 dependency 包含相关 plugin 的方式，在 yarn2 下并不通用。

## 与项目配置区分的原因

1. 已有配置已经十分多，且大部分可视为最佳实践，无需在项目 eslintrc 中，经常维护
2. 对于本配置包中导出配置，可视为行业最佳实践。无论后续项目 eslint 配置如何演化，如分 project 维护，或者当前配置根据所处情况而变，此部分应保持为 base 配置
3. 未来如需将此配置迁移至 gitlab 发包维护，方便迁移
