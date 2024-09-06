import { CheckboxFieldFormElement } from "./fields/CheckboxField";
import { DateFieldFormElement } from "./fields/DateField";
import { EmailFieldFormElement } from "./fields/EmailField";
import { NumberFieldFormElement } from "./fields/NumberField";
import { ParagraphFieldFormElement } from "./fields/ParagraphField";
import { SelectFieldFormElement } from "./fields/SelectField";
import { SeparatorFieldFormElement } from "./fields/SeparatorField";
import { SpacerFieldFormElement } from "./fields/SpacerField";
import { SubTitleFieldFormElement } from "./fields/SubTitleField";
import { TextareaFieldFormElement } from "./fields/TextareaField";
import { TextFieldFormElement } from "./fields/TextField";
import { TitleFieldFormElement } from "./fields/TitleField";

export type ElementsType =
    | "EmailFIeld"
    | "TextField"
    | "TitleField"
    | "SubTitleField"
    | "ParagraphField"
    | "SeparatorField"
    | "SpacerField"
    | "NumberField"
    | "TextareaField"
    | "DateField"
    | "CheckboxField"
    | "SelectField";
export type SubmitFunction = (key: string, value: string) => void;

export type FormElement = {
    type: ElementsType;
    construct: (id: string) => FormElementInstance;
    designerComponent: React.FC<{
        elementInstance: FormElementInstance;
    }>;
    formComponent: React.FC<{
        elementInstance: FormElementInstance;
        submitValue?: SubmitFunction;
        isInvalid?: boolean;
        defaultValue?: string;
    }>;
    propertiesComponent: React.FC<{
        elementInstance: FormElementInstance;
    }>;
    designerButtonElement: {
        icon: React.ElementType;
        label: string;
    };
    validate: (
        formElement: FormElementInstance,
        currentValue: string
    ) => boolean;
};

export type FormElementInstance = {
    id: string;
    type: ElementsType;
    extraAttributes?: Record<string, any>;
};

type FormElementsType = {
    [key in ElementsType]: FormElement;
};

export const FormElements: FormElementsType = {
    TextField: TextFieldFormElement,
    TitleField: TitleFieldFormElement,
    SubTitleField: SubTitleFieldFormElement,
    ParagraphField: ParagraphFieldFormElement,
    SeparatorField: SeparatorFieldFormElement,
    SpacerField: SpacerFieldFormElement,
    NumberField: NumberFieldFormElement,
    EmailFIeld: EmailFieldFormElement,
    TextareaField: TextareaFieldFormElement,
    DateField: DateFieldFormElement,
    SelectField: SelectFieldFormElement,
    CheckboxField: CheckboxFieldFormElement
};
