"use client";

/**
 * DeleteDialog component renders a dialog for confirming the deletion of an item.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.id - The unique identifier of the item to be deleted.
 * @param {function} props.action - The function to be called to perform the deletion action.
 * It takes the item id as an argument and returns a promise that resolves to an object
 * containing a success boolean and a message string.
 *
 * @returns {JSX.Element} The rendered DeleteDialog component.
 */
const DeleteDialog = ({
  id,
  action,
}: {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
}) => {
  return <div>DeleteDialog</div>;
};

export default DeleteDialog;
