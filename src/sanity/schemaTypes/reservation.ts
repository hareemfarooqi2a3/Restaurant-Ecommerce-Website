export default {
  name: "reservation",
  type: "document",
  title: "Table Reservation",
  fields: [
    {
      name: "reservationId",
      type: "string",
      title: "Reservation ID",
      readOnly: true,
    },
    {
      name: "customerName",
      type: "string",
      title: "Customer Name",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "customerEmail",
      type: "string",
      title: "Customer Email",
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: "customerPhone",
      type: "string",
      title: "Customer Phone",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "reservationDate",
      type: "datetime",
      title: "Reservation Date & Time",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "partySize",
      type: "number",
      title: "Party Size",
      validation: (Rule: any) => Rule.required().min(1).max(20),
    },
    {
      name: "tableType",
      type: "string",
      title: "Table Type",
      options: {
        list: [
          { title: "Regular Table", value: "regular" },
          { title: "Window Table", value: "window" },
          { title: "Private Booth", value: "booth" },
          { title: "Outdoor Seating", value: "outdoor" },
        ],
      },
    },
    {
      name: "specialRequests",
      type: "text",
      title: "Special Requests",
    },
    {
      name: "status",
      type: "string",
      title: "Reservation Status",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Completed", value: "completed" },
        ],
      },
      initialValue: "pending",
    },
    {
      name: "createdAt",
      type: "datetime",
      title: "Created At",
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: "customerName",
      subtitle: "reservationDate",
      status: "status",
    },
    prepare(selection: any) {
      const { title, subtitle, status } = selection;
      return {
        title: title || "New Reservation",
        subtitle: `${new Date(subtitle).toLocaleDateString()} - ${status}`,
      };
    },
  },
};