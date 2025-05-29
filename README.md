# Alauda Frontend Plugin Template

## 本地开发指南

1. 执行 `yarn install` 安装依赖
2. 执行 `yarn nx serve deploy-instance` 或 `yarn nx serve service` 启动`部署 Operator 实例的 UI 插件`或 `Operator 功能 UI 插件`的本地开发服务，服务端口为 `localhost:5000`。
3. 进入 `alauda-fe` 项目目录启动要集成插件的项目，启动后产品页面将自动加载 5000 端口上正在运行的插件，此时按需进行调试开发即可。
4. 也可以在浏览器打开 `http://localhost:5000` 直接对插件页面进行调试开发。

## 代码结构说明

1. `apps/deploy-instance`, `apps/service` 项目分别对应 Operator 实例部署表单 UI 插件和功能 UI 插件。
2. 插件基于 Webpack 模块联邦机制进行构建打包，`module-federation.config.js` 文件用于配置插件模块导出出口。
3. `console-plugin.json` 用于配置 ACP 宿主项目如何加载当前插件，请于对应版本的 ACP 文档中查看支持的插件类型和配置属性。

## 构建镜像

1. 执行 `yarn nx build deploy-instance` 或 `yarn nx build service` 编译插件代码，产出物位于 `./dist/apps`。
2. 通过 Docker 构建镜像，并在构建时将 `./dist/apps` 目录下的所有内容拷贝至镜像的 `/frontend-plugins` 目录下（可以使用代码仓库内的 `Dockerfile` 进行构建）。

## 在 Operator 内配置使用镜像

- **部署实例 UI**  
  `cpaas.io/frontend-plugin-deploy-instance-image: <namespace/name:tag>`

- **功能 UI**
  - 单一：`cpaas.io/frontend-plugin-service-image: <namespace/name:tag>`
  - 多模块：`cpaas.io/frontend-plugin-service-image-<subpath>: <namespace/name:tag>`

**示例**：

```yaml
metadata:
  annotations:
    cpaas.io/frontend-plugin-deploy-instance-image: frontend/plugin:v1.0.0
    cpaas.io/frontend-plugin-service-image: frontend/plugin:v1.0.0
```
