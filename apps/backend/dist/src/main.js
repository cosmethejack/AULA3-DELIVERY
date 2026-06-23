"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./core/observability/otel");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const problem_details_filter_1 = require("./core/filters/problem-details.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix("v1");
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalFilters(new problem_details_filter_1.ProblemDetailsFilter());
    await app.listen(process.env.BACKEND_PORT || 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map