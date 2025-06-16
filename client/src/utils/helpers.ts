export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;
}

export const capitalizeFirstLetter = (str: string): string => {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

// Đổi tên và cập nhật function để format VND
export function formatToVND(number: number): string {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return formatter.format(number);
}

// Giữ lại function cũ để backward compatibility
export function formatToINR(number: number): string {
  // Có thể chuyển sang VND hoặc giữ nguyên tùy nhu cầu
  return formatToVND(number);
}

export const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(seconds / 86400); // 86400 seconds in a day
  const hours = Math.floor((seconds % 86400) / 3600); // 3600 seconds in an hour
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
  return formattedTime;
};