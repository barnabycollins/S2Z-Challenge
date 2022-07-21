import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { OffsetPlanEntry } from "./constructs";

interface OffsetPlanFormProps {
  updatePlan(newPlan: OffsetPlanEntry[]): void
};

export function OffsetPlanForm(updatePlan: (newPlan: OffsetPlanEntry[]) => void) {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      offsetRows: [{ month: 7, year: 2022, trees: 0 }]
    }
  });
  const onSubmit = (data: any) => console.log(data);

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
          <tr>
            <th>Month (1-12)</th>
            <th>Year</th>
            <th>Tree count (0-55)</th>
            <th></th>
          </tr>
          {fields.map((item, index) => {
            return (
              <tr key={item.id}>
                <td><input {...register(`offsetRows.${index}.month`, { required: true, min: 1, max: 12 })} /></td>
                <td><input {...register(`offsetRows.${index}.year`, { required: true, min: 1900, max: 3000 })} /></td>
                <td><input {...register(`offsetRows.${index}.trees`, { required: true, min: 0, max: 55 })} /></td>

                <td><button type="button" onClick={() => remove(index)}>Delete Row</button></td>
              </tr>
            );
          })}
        
        </table>
        <button type="button" onClick={() => append({})}>Add Row</button>
        <input type="submit" id="submit-btn"></input>
      </form>
    </div>
  );
}

export default OffsetPlanForm;