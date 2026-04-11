import { useToast } from '../context/ToastContext';

const Toast = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-xs">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-2xl border-l-4 p-4 shadow-[0_15px_30px_rgba(0,0,0,0.25)]"
          style={{
            background: '#0d0b07',
            borderColor: toast.type === 'error' ? '#d74a4a' : toast.type === 'success' ? '#d4aa40' : '#4f83ff',
            color: '#f5ecd8',
          }}
        >
          <div className="text-sm leading-tight">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
