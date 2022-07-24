import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { OffsetPlanEntry } from "./constructs";
import { countries, consumptions } from "./countryConsumptionData";
import { CURRENT_MONTH, CURRENT_YEAR, monthsBetween } from "./dates";
import { PLANT_COST } from "./offsetCalculations";

interface OffsetPlanFormProps {
  updateFormData(formData: FormDataType): void,
  totalTrees: number
};

export interface FormDataType {
    /**
     * The interface representing the data from the form.
     */

    estimatedProduction: number,
    offsetPlan: OffsetPlanEntry[]
}

interface OffsetEntryType {
  /**
   * Interface representing a single entry in the form. Not to be confused with
   * OffsetPlanEntry, which stores the date in a MonthDate.
   */
  month: number,
  year: number,
  trees: number
}

interface InputDataType {
  country: string,
  offsetRows: OffsetEntryType[]
}

export function OffsetPlanForm(props: OffsetPlanFormProps) {
  /**
   * Component representing the UI offset input form.
   */

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
    /**
     * Runs when the form is submitted.
     */

    // Turn the form data into an OffsetPlanEntry[] for the rest of the application to use
    let offsetPlan: OffsetPlanEntry[] = data.offsetRows.map((entry: OffsetEntryType) => ({
      date: {
        month: entry.month,
        year: entry.year
      },
      trees: entry.trees
    }));

    // Sort plan into chronological order
    offsetPlan.sort((a, b) => monthsBetween(b.date, a.date));

    // Pass the form data back up through the hierarchy to the App component.
    props.updateFormData({
      estimatedProduction: consumptions[data.country],
      offsetPlan: offsetPlan
    });
  };

  // Run onSubmit() whenever the form is updated
  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  // Initialise a field array (this allows us to add and remove form entries as required)
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
              // Generate a form row for each item in the field array

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
      </div>
    </form>
  );
}

export default OffsetPlanForm;