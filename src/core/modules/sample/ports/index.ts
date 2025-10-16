import { Pipeline } from "src/core/context/pipeline";

// Import functions
import { predictFuture } from "../functions/predict-future";
import { rateMyCode } from "../functions/rate-mycode";
import { motivateDeveloper } from "../functions/motivate-developer";
import { translateToMeow } from "../functions/translate-to-meow";
import { shouldIDeployToday } from "../functions/should-deploy-today";

// Import types
import type { RuntimeContext } from "src/core/context/runtime-context";

/**
 * Dự đoán tương lai dev.
 */
export const predictFuturePipeline = new Pipeline<RuntimeContext>(
  "Predict future pipeline",
);

/**
 * Đánh giá code của dev.
 */
export const rateCodePipeline = new Pipeline<RuntimeContext>(
  "Rate code pipeline",
);

/**
 * Động viên dev khi đang mệt.
 */
export const motivateDevPipeline = new Pipeline<RuntimeContext>(
  "Motivate dev pipeline",
);

/**
 * Dịch câu nói sang tiếng mèo.
 */
export const catTranslatorPipeline = new Pipeline<RuntimeContext>(
  "Cat translator pipeline",
);

/**
 * Hỏi xem hôm nay có nên deploy không.
 */
export const shouldDeployPipeline = new Pipeline<RuntimeContext>(
  "Should deploy pipeline",
);

// Setup các bước xử lý
predictFuturePipeline
  .addStep(predictFuture)
  .addStep(Pipeline.processRuntimeResult);
rateCodePipeline.addStep(rateMyCode).addStep(Pipeline.processRuntimeResult);
motivateDevPipeline
  .addStep(motivateDeveloper)
  .addStep(Pipeline.processRuntimeResult);
catTranslatorPipeline
  .addStep(translateToMeow)
  .addStep(Pipeline.processRuntimeResult);
shouldDeployPipeline
  .addStep(shouldIDeployToday)
  .addStep(Pipeline.processRuntimeResult);
