export const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $ref: "#/definitions/Notebook",
  definitions: {
    Notebook: {
      type: "object",
      properties: {
        metadata: {
          $ref: "#/definitions/NotebookMetadata",
        },
        "ui-specification": {
          $ref: "#/definitions/NotebookUISpec",
        },
      },
      required: ["metadata", "ui-specification"],
      additionalProperties: false,
    },
    NotebookMetadata: {
      type: "object",
      properties: {
        name: { type: "string" },
        project_id: { type: "string" },
        notebook_version: { type: "string" },
        schema_version: { type: "string" },
      },
      required: ["name", "notebook_version", "schema_version"],
      additionalProperties: {},
    },
    NotebookUISpec: {
      type: "object",
      properties: {
        fields: {
          type: "object",
          additionalProperties: {
            $ref: "#/definitions/FieldType",
          },
        },
        fviews: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              fields: {
                type: "array",
                items: {type: "string",},
              },
              uidesign: {type: "string",},
              label: {type: "string",},
              condition: {
                $ref: "#/definitions/ConditionType",
              },
            },
            required: ["fields", "label"],
          },
        },
        viewsets: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              views: {
                type: "array",
                items: {type: "string",},
              },
              label: {type: "string",},
            },
            required: ["views", "label"],
          },
        },
        visible_types: {
          type: "array",
          items: {type: "string",},
        },
      },
      required: ["fields", "fviews", "viewsets", "visible_types"],
      additionalProperties: false,
    },
    FieldType: {
      type: "object",
      properties: {
        "component-namespace": {type: "string",},
        "component-name": {type: "string",},
        "type-returned": {type: "string",},
        "component-parameters": {
          $ref: "#/definitions/ComponentParameters",
        },
        validationSchema: {
          type: "array",
          items: {
            $ref: "#/definitions/ValidationSchemaElement",
          },
        },
        initialValue: {},
        access: {
          type: "array",
          items: {type: "string",},
        },
        condition: {
          anyOf: [
            {
              $ref: "#/definitions/ConditionType",
            },
            {
              type: "null",
            },
          ],
        },
        persistent: {type: "boolean",},
        displayParent: {type: "boolean",},
        meta: {
          type: "object",
          properties: {
            annotation: {
              anyOf: [
                {
                  type: "boolean",
                },
                {
                  type: "object",
                  properties: {
                    include: {
                      type: "boolean",
                    },
                    label: {type: "string",},
                  },
                  required: ["include", "label"],
                  additionalProperties: false,
                },
              ],
            },
            annotation_label: {type: "string",},
            uncertainty: {
              type: "object",
              properties: {
                include: {type: "boolean",},
                label: {type: "string",},
              },
              required: ["include", "label"],
              additionalProperties: false,
            },
          },
          required: ["annotation", "uncertainty"],
          additionalProperties: false,
        },
      },
      required: [
        "component-namespace",
        "component-name",
        "type-returned",
        "component-parameters",
      ],
      additionalProperties: false,
    },
    ComponentParameters: {
      type: "object",
      properties: {
        fullWidth: {type: "boolean",},
        name: {type: "string",},
        id: {type: "string",},
        helperText: {type: "string",},
        helpertext: {type: "string",},
        variant: {type: "string",},
        label: {type: "string",},
        multiline: {type: "boolean",},
        multiple: {type: "boolean",},
        SelectProps: {},
        ElementProps: {
          type: "object",
          properties: {
            options: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  value: {type: "string",},
                  label: {type: "string",},
                  RadioProps: {},
                },
                required: ["value", "label"],
                additionalProperties: false,
              },
            },
            optiontree: {},
          },
          additionalProperties: true,
        },
        InputLabelProps: {
          type: "object",
          properties: {
            label: {type: "string",},
          },
          required: ["label"],
          additionalProperties: true,
        },
        InputProps: {
          type: "object",
          properties: {
            rows: {
              type: "number",
            },
            type: {
              type: "string",
            },
          },
        },
        FormLabelProps: {
          type: "object",
          properties: {
            children: {
              type: "string",
            },
          },
          additionalProperties: false,
        },
        FormHelperTextProps: {
          type: "object",
          properties: {
            children: {type: "string",
            },
          },
          additionalProperties: false,
        },
        FormControlLabelProps: {
          type: "object",
          properties: {
            label: {type: "string",},
          },
          required: ["label"],
          additionalProperties: false,
        },
        initialValue: {},
        related_type: {type: "string",},
        relation_type: {type: "string",},
        related_type_label: {type: "string",},
        relation_linked_vocabPair: {
          type: "array",
          items: {
            type: "array",
            items: {
              type: "string",
            },
            minItems: 2,
            maxItems: 2,
          },
        },
        required: {type: "boolean",},
        template: {type: "string",},
        num_digits: {type: "number",},
        form_id: {type: "string",},
        is_auto_pick: {type: "boolean",},
        zoom: {"anyOf": [
            {type: "number",},
            {type: "string"},
        ]},
        featureType: {type: "string",},
        variant_style: {type: "string",},
        html_tag: {type: "string",},
        content: {type: "string",},
        hrid: {type: "boolean",},
        select: {type: "boolean",},
        geoTiff: {type: "string",},
        type: {type: "string",},
        valuetype: {type: "string",},
      },
      additionalProperties: true,
    },
    ValidationSchemaElement: {
      type: "array",
      items: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "number",
          },
          {
            $ref: "#/definitions/ValidationSchemaElement",
          },
        ],
      },
    },
    ConditionType: {
      type: "object",
      properties: {
        operator: {type: "string",},
        field: {type: "string",},
        value: {},
        conditions: {
          type: "array",
          items: {
            $ref: "#/definitions/ConditionType",
          },
        },
      },
      required: ["operator"],
      additionalProperties: false,
    },
  },
};
