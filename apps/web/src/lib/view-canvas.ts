export type CanvasViewport = {
  canvasWidth: number;
  canvasHeight: number;
  offsetX: number;
  offsetY: number;
  zoom: number;
};

const minZoom = 0.4;
const maxZoom = 2.5;

export function clampCanvasZoom(zoom: number): number {
  return Math.min(maxZoom, Math.max(minZoom, zoom));
}

export function createCanvasViewport(
  input?: Partial<CanvasViewport>
): CanvasViewport {
  return {
    canvasWidth: input?.canvasWidth ?? 1200,
    canvasHeight: input?.canvasHeight ?? 800,
    offsetX: input?.offsetX ?? 0,
    offsetY: input?.offsetY ?? 0,
    zoom: clampCanvasZoom(input?.zoom ?? 1)
  };
}

export function panCanvasViewport<T extends CanvasViewport>(
  viewport: T,
  input: {
    deltaX: number;
    deltaY: number;
  }
): T;
export function panCanvasViewport<T extends CanvasViewport>(
  viewport: T,
  input: {
    deltaX: number;
    deltaY: number;
  }
): T {
  return {
    ...viewport,
    offsetX: viewport.offsetX + input.deltaX,
    offsetY: viewport.offsetY + input.deltaY
  };
}

export function resizeCanvasViewport<T extends CanvasViewport>(
  viewport: T,
  input: {
    canvasWidth: number;
    canvasHeight: number;
  }
): T;
export function resizeCanvasViewport<T extends CanvasViewport>(
  viewport: T,
  input: {
    canvasWidth: number;
    canvasHeight: number;
  }
): T {
  return {
    ...viewport,
    canvasWidth: Math.max(640, Math.round(input.canvasWidth)),
    canvasHeight: Math.max(480, Math.round(input.canvasHeight))
  };
}

export function zoomCanvasViewport<T extends CanvasViewport>(
  viewport: T,
  nextZoom: number
): T;
export function zoomCanvasViewport<T extends CanvasViewport>(
  viewport: T,
  nextZoom: number
): T {
  return {
    ...viewport,
    zoom: clampCanvasZoom(nextZoom)
  };
}
