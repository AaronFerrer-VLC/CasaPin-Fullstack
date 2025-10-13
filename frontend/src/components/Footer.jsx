export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} Casa Pin · Asturias
      </div>
    </footer>
  );
}
