function SubmitButton({
  isLoading,
  error,
  disabled,
}: {
  isLoading: boolean;
  error: String;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <input
        type="submit"
        value={isLoading ? "Loading..." : "Submit"}
        className={`w-80 rounded-2xl px-4 py-3 font-bold text-white shadow-xl ${
          disabled ? "bg-gray-500" : " bg-orange-400"
        }`}
        disabled={disabled}
      />
      <span className="text-sm text-red-900">{error}</span>
    </div>
  );
}

export default SubmitButton;
