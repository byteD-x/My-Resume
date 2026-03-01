import {
  chromaticAberrationFragmentShader,
  chromaticAberrationVertexShader,
} from "./chromaticAberration";
import { bloomFragmentShader, bloomVertexShader } from "./bloom";
import {
  holographicFragmentShader,
  holographicVertexShader,
} from "./holographic";
import {
  liquidMetalFragmentShader,
  liquidMetalVertexShader,
} from "./liquidMetal";
import {
  noiseDisplacementFragmentShader,
  noiseDisplacementVertexShader,
} from "./noiseDisplacement";
import { particleFragmentShader, particleVertexShader } from "./particle";

export interface ShaderSourcePair {
  vertexShader: string;
  fragmentShader: string;
}

export const SHADER_LIBRARY: Record<string, ShaderSourcePair> = {
  holographic: {
    vertexShader: holographicVertexShader,
    fragmentShader: holographicFragmentShader,
  },
  liquidMetal: {
    vertexShader: liquidMetalVertexShader,
    fragmentShader: liquidMetalFragmentShader,
  },
  chromaticAberration: {
    vertexShader: chromaticAberrationVertexShader,
    fragmentShader: chromaticAberrationFragmentShader,
  },
  noiseDisplacement: {
    vertexShader: noiseDisplacementVertexShader,
    fragmentShader: noiseDisplacementFragmentShader,
  },
  bloom: {
    vertexShader: bloomVertexShader,
    fragmentShader: bloomFragmentShader,
  },
  particle: {
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
  },
};
