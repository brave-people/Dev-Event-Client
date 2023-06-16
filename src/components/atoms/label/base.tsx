const Base = ({
  title,
  htmlFor,
  required,
}: {
  title: string;
  htmlFor: string;
  required: boolean;
}) => {
  if (!title) return null;

  return (
    <label
      htmlFor={htmlFor}
      className="form__content__title inline-block text-base font-medium text-gray-600"
    >
      {title}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
};

export default Base;
