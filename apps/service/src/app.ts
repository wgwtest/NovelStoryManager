import Fastify from "fastify";
import { z } from "zod";

import {
  chapterSliceSchema,
  graphLayoutSchema,
  objectTypeNameSchema,
  trackPresetSchema
} from "@novelstory/schema";

import {
  createObject,
  createProject,
  exportObjectBatch,
  exportProjectBundle,
  importObjectBatch,
  importProjectBundle,
  loadProject,
  ProjectStoreValidationError,
  updateGraphLayout,
  updateChapterSlice,
  updateTrackPreset,
  updateObject
} from "./lib/project-store.js";

const openProjectBodySchema = z.object({
  projectPath: z.string().min(1)
});

const createProjectBodySchema = z.object({
  projectPath: z.string().min(1),
  projectId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional()
});

const createObjectBodySchema = z.object({
  projectPath: z.string().min(1),
  objectType: objectTypeNameSchema,
  seed: z.record(z.string(), z.unknown()).optional()
});

const exportProjectBodySchema = z.object({
  projectPath: z.string().min(1)
});

const importProjectBodySchema = z.object({
  projectPath: z.string().min(1),
  bundle: z.unknown()
});

const updateObjectBodySchema = z.object({
  projectPath: z.string().min(1),
  objectType: objectTypeNameSchema,
  objectId: z.string().min(1),
  changes: z.record(z.string(), z.unknown())
});

const exportObjectBatchBodySchema = z.object({
  projectPath: z.string().min(1),
  objectTypes: z.array(objectTypeNameSchema).min(1)
});

const importObjectBatchBodySchema = z.object({
  projectPath: z.string().min(1),
  bundle: z.unknown()
});

const updateGraphLayoutBodySchema = z.object({
  projectPath: z.string().min(1),
  layout: graphLayoutSchema
});

const updateTrackPresetBodySchema = z.object({
  projectPath: z.string().min(1),
  preset: trackPresetSchema
});

const updateChapterSliceBodySchema = z.object({
  projectPath: z.string().min(1),
  slice: chapterSliceSchema
});

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown server error.";
}

export function buildApp(input: { sampleProjectPath: string }) {
  const app = Fastify({
    logger: false
  });

  app.get("/api/health", async () => ({
    status: "ok"
  }));

  app.get("/api/projects/sample", async () => ({
    projectPath: input.sampleProjectPath,
    project: await loadProject(input.sampleProjectPath)
  }));

  app.post("/api/projects/open", async (request) => {
    const body = openProjectBodySchema.parse(request.body);

    return {
      projectPath: body.projectPath,
      project: await loadProject(body.projectPath)
    };
  });

  app.post("/api/projects/create", async (request, reply) => {
    const body = createProjectBodySchema.parse(request.body);
    const project = await createProject(body);

    reply.code(201);
    return {
      projectPath: body.projectPath,
      project
    };
  });

  app.post("/api/projects/export", async (request) => {
    const body = exportProjectBodySchema.parse(request.body);

    return {
      bundle: await exportProjectBundle(body.projectPath)
    };
  });

  app.post("/api/projects/import", async (request, reply) => {
    const body = importProjectBodySchema.parse(request.body);
    const project = await importProjectBundle(body);

    reply.code(201);
    return {
      projectPath: body.projectPath,
      project
    };
  });

  app.patch("/api/projects/object", async (request) => {
    const body = updateObjectBodySchema.parse(request.body);

    return {
      object: await updateObject(body)
    };
  });

  app.post("/api/projects/object", async (request, reply) => {
    const body = createObjectBodySchema.parse(request.body);

    reply.code(201);

    if (body.seed !== undefined) {
      return {
        object: await createObject({
          projectPath: body.projectPath,
          objectType: body.objectType,
          seed: body.seed
        })
      };
    }

    return {
      object: await createObject({
        projectPath: body.projectPath,
        objectType: body.objectType
      })
    };
  });

  app.patch("/api/projects/graph-layout", async (request) => {
    const body = updateGraphLayoutBodySchema.parse(request.body);

    return {
      layout: await updateGraphLayout(body)
    };
  });

  app.patch("/api/projects/track-preset", async (request) => {
    const body = updateTrackPresetBodySchema.parse(request.body);

    return {
      preset: await updateTrackPreset(body)
    };
  });

  app.patch("/api/projects/chapter-slice", async (request) => {
    const body = updateChapterSliceBodySchema.parse(request.body);

    return {
      slice: await updateChapterSlice(body)
    };
  });

  app.post("/api/projects/object-batch/export", async (request) => {
    const body = exportObjectBatchBodySchema.parse(request.body);

    return {
      bundle: await exportObjectBatch(body)
    };
  });

  app.post("/api/projects/object-batch/import", async (request) => {
    const body = importObjectBatchBodySchema.parse(request.body);
    const project = await importObjectBatch(body);

    return {
      projectPath: body.projectPath,
      project
    };
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof z.ZodError) {
      reply.status(400).send({
        message: error.issues[0]?.message ?? "Validation failed.",
        issues: error.issues
      });
      return;
    }

    if (error instanceof ProjectStoreValidationError) {
      reply.status(400).send({
        message: error.message
      });
      return;
    }

    if (isErrnoException(error) && error.code === "ENOENT") {
      reply.status(404).send({
        message: "Requested project path was not found."
      });
      return;
    }

    const message = getErrorMessage(error);

    if (message.includes("was not found in")) {
      reply.status(404).send({
        message
      });
      return;
    }

    reply.status(500).send({
      message
    });
  });

  return app;
}
