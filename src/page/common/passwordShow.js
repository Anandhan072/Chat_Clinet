import { CreatePassword } from "./reUsableComponet";

const PasswordShow = () => {
  return (
    <>
      <div>
        <input type="email" name="email" placeholder="Enter your username" />
        <CreatePassword />
      </div>
    </>
  );
};

export default PasswordShow;
