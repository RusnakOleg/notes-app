const variants = {
  default:
    'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  primary: 'border border-blue-600 bg-blue-600 text-white hover:bg-blue-700',
  danger:
    'border border-slate-300 bg-white text-red-600 hover:bg-red-50 dark:border-slate-600 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-slate-700',
};

export function Button({ variant = 'default', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-default disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}