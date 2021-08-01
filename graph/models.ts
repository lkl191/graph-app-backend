import { model, Schema } from "mongoose";

const graphSchema = new Schema({
  title: String,
  category: String,
  graphKind: { type: String, enum: ["LINE", "BAR", "PIE", "RADAR", "SCATTER"] },
  userId: String,
  data: [
    {
      label: String,
      value: Number
    }
  ]
});

const Graph = model("Graph", graphSchema);
export default Graph;
