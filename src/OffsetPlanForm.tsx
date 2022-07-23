import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormDataType, OffsetPlanEntry } from "./constructs";
import { countries, consumptions } from "./countryConsumptionData";
import { CURRENT_MONTH, CURRENT_YEAR, monthsBetween } from "./dates";
import { PLANT_COST } from "./offsetCalculations";

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
      offsetRows: [
        { month: CURRENT_MONTH, year: CURRENT_YEAR, trees: 50 },
        { month: 1, year: CURRENT_YEAR+1, trees: 30 },
      ]
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
      estimatedProduction: consumptions[data.country],
      offsetPlan: offsetPlan
    });
  };

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "offsetRows"
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="offsetForm">
      <div>
        <label>Your country:</label>
        <select {...register("country", {required: true})}>
          {countries.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      <div id="tableContainer">
        <h2>Purchases</h2>
        <div id="tableScrollBox">
          <table>
            <thead>
              <tr>
                <th>Month (1-12)</th>
                <th>Year</th>
                <th>Trees to plant</th>
                <th>Planting cost</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {fields.map((item, index) => {
              const monthClass = errors.offsetRows?.[index]?.month !== undefined ? "validationError" : "";
              const yearClass = errors.offsetRows?.[index]?.year !== undefined ? "validationError" : "";
              const treesClass = errors.offsetRows?.[index]?.trees !== undefined ? "validationError" : "";

              return (
                <tr key={item.id}>
                  <td><input className={monthClass} type="number" {...register(`offsetRows.${index}.month`, { required: true, valueAsNumber: true, min: 1, max: 12 })} /></td>
                  <td><input className={yearClass} type="number" {...register(`offsetRows.${index}.year`, { required: true, valueAsNumber: true, min: 1900, max: 3000 })} /></td>
                  <td><input className={treesClass} type="number" {...register(`offsetRows.${index}.trees`, { required: true, valueAsNumber: true, min: 0 })} /></td>

                  <td>{`$${watch(`offsetRows.${index}.trees`)*PLANT_COST || 0}`}</td>

                  <td>{index !== 0 ? <button type="button" onClick={() => remove(index)}>Delete</button> : <></>}</td>
                </tr>
              );
            })}
            <tr>
              <th colSpan={2} id="totalTitle">Totals</th>
              <td>{props.totalTrees}</td>
              <td>${props.totalTrees*PLANT_COST}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <button type="button" onClick={() => append({})}>Add Purchase</button>
        {/*<input type="submit" id="submit-btn" value="Update Data"></input>*/}
      </div>
    </form>
  );
}

export default OffsetPlanForm;