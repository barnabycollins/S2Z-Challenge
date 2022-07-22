import { useFieldArray, useForm } from "react-hook-form";
import { FormDataType, OffsetPlanEntry } from "./constructs";
import { countries, consumptions } from "./countryConsumptionData";
import { CURRENT_MONTH, CURRENT_YEAR, monthsBetween } from "./dates";
import { MATURE_CARBON_ANNUAL } from "./offsetCalculations";

interface OffsetPlanFormProps {
  updateFormData(formData: FormDataType): void,
  totalTrees: number
};

interface OffsetEntryType {
  month: number,
  year: number,
  trees: number
}

interface InputDataType {
  country: string,
  offsetRows: OffsetEntryType[]
}

export function OffsetPlanForm(props: OffsetPlanFormProps) {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      country: "United Kingdom",
      offsetRows: [{ month: CURRENT_MONTH, year: CURRENT_YEAR, trees: 0 }]
    }
  });

  const onSubmit = (data: InputDataType) => {
    let offsetPlan: OffsetPlanEntry[] = data.offsetRows.map((entry: OffsetEntryType) => ({
      date: {
        month: entry.month,
        year: entry.year
      },
      trees: entry.trees
    }));

    // Sort plan into chronological order
    offsetPlan.sort((a, b) => monthsBetween(b.date, a.date));

    props.updateFormData({
      estimatedConsumption: consumptions[data.country],
      offsetPlan: offsetPlan
    });
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
        <select {...register("country", {required: true})}>
          {countries.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select><br></br>
        Average personal consumption: {consumptions[watch("country")]} tons per year.
        <br></br>
        Minimum number of fully-grown trees required to replenish this annual usage: {Math.ceil(consumptions[watch("country")]*1000 / MATURE_CARBON_ANNUAL)}
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

                <td>{index !== 0 ? <button type="button" onClick={() => remove(index)}>Delete Row</button> : <></>}</td>
              </tr>
            );
          })}
          <tr>
            <th colSpan={2} id="totalTitle">Total</th><td>{props.totalTrees}</td>
          </tr>
          </tbody>
        </table>

        <button type="button" onClick={() => append({})}>Add Row</button>
        <input type="submit" id="submit-btn" value="Update Graphs"></input>
      </form>
    </div>
  );
}

export default OffsetPlanForm;