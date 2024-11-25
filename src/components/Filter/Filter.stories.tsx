import { Meta, StoryObj } from "@storybook/react";
import Filter from "./Filter";

type FiltersType = typeof Filter;

const meta: Meta<FiltersType> = {
  title: "Components/Filter",
  component: Filter,
};

export default meta;

type Story = StoryObj<FiltersType>;

const handleApplyFilters = (selectedFilters: { [key: string]: string[] }) => {
  console.log("Выбранные фильтры:", selectedFilters);
  // Здесь можно выполнить фильтрацию данных на основе выбранных фильтров
};

export const Default: Story = {
  render: (arguments_) => (
    <Filter onApplyFilters={handleApplyFilters}>
      <Filter.Content.FilterTextField
        title="Номер карты"
        value=""
        onChange={() => { }}
      />

      <Filter.Content.SingleChoice
        title="Тип операции"
        options={[
          { label: "Все", value: "all" },
          { label: "Списание", value: "-1" },
          { label: "Пополнение", value: "1" },
        ]}
      />

      <Filter.Content.MultipleChoice
        title="Топливо"
        options={[
          { label: "АИ-92", value: "1" },
          { label: "АИ-95", value: "2" },
          { label: "АИ-98", value: "3" },
          { label: "ДТ", value: "4" },
          { label: "Газ", value: "5" },
        ]}
      />
    </Filter>
  ),
};
