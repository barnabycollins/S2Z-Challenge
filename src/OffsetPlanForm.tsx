import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { OffsetPlanEntry } from "./constructs";

interface OffsetPlanFormProps {
  updatePlan(newPlan: OffsetPlanEntry[]): void
};

interface FormEntryType {
  month: number,
  year: number,
  trees: number
}

interface FormDataType {
  offsetRows: FormEntryType[]
}

export function OffsetPlanForm(props: OffsetPlanFormProps) {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      offsetRows: [{ month: 7, year: 2022, trees: 0 }]
    }
  });

  const onSubmit = (data: FormDataType) => {
    props.updatePlan(data.offsetRows.map((entry: FormEntryType) => {
      return {
        date: {
          month: entry.month,
          year: entry.year
        },
        trees: entry.trees
      }
    }));
  };

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "offsetRows"
  });

  return (
    <div id="offsetForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <table>
          <thead>
            <tr>
              <th>Month (1-12)</th>
              <th>Year</th>
              <th>Tree count (0-55)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {fields.map((item, index) => {
            return (
              <tr key={item.id}>
                <td><input type="number" {...register(`offsetRows.${index}.month`, { required: true, valueAsNumber: true, min: 1, max: 12 })} /></td>
                <td><input type="number" {...register(`offsetRows.${index}.year`, { required: true, valueAsNumber: true, min: 1900, max: 3000 })} /></td>
                <td><input type="number" {...register(`offsetRows.${index}.trees`, { required: true, valueAsNumber: true, min: 0, max: 55 })} /></td>

                <td><button type="button" onClick={() => remove(index)}>Delete Row</button></td>
              </tr>
            );
          })}
          </tbody>
        </table>

        <button type="button" onClick={() => append({})}>Add Row</button>
        <input type="submit" id="submit-btn"></input>
      </form>
    </div>
  );
}

export default OffsetPlanForm;