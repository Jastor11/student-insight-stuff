  const Colors = {
  purple: '#e8e9fc',
  orange: '#ffe7d6',
  green: '#e8fce8',
  gray: '#eee'
};

// Map service_type_id to a themed color.
const serviceColor = window.shared.serviceColor = function(serviceTypeId) {
  const map = {
   507: Colors.orange,
   502: Colors.green,
   503: Colors.green,
   504: Colors.green,
   505: Colors.gray,
   506: Colors.gray,
   508: Colors.purple
  };
  return map[serviceTypeId] || null;
};

module.exports = serviceColor;