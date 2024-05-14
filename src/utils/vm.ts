import vm from "node:vm";

const executeCode = async (userCode: string, interaction: any) => {
  const sandbox: vm.Context = {
    console,
    interaction,
  };

  const vmOptions: vm.CreateContextOptions = {};

  const vmContext = vm.createContext(sandbox, vmOptions);

  try {
    const result = await vm.runInContext(userCode, vmContext);
    return result; // Return the result from user code
  } catch (error) {
    throw error;
  }
};

export default executeCode;
