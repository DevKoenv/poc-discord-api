export default {
  User: {
    type: "object",
    properties: {
      id: { type: "string" },
      username: { type: "string" },
      globalName: { type: "string" },
      avatar: { type: "string" },
      email: { type: "string" },
      refreshToken: { type: "string" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
      roles: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Role",
        },
      },
    },
  },
  Role: {
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
    },
  },
  Guild: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      icon: { type: "string" },
      prefix: { type: "string" },
      language: { type: "string" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
    },
  },
  Command: {
    type: "object",
    properties: {
      id: { type: "integer" },
      trigger: { type: "string" },
      response: { type: "string" },
      interaction: { type: "string" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
    },
  },
};
