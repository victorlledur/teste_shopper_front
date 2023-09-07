import { useState } from "react";
import Papa from "papaparse";
import { byIdProduct, listProducts, updateProduct } from "../../services/mainApi/products";

const allowedExtensions = ["csv"];

const Home = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [canUpdate, setCanUpdate] = useState(false);

  const handleFileChange = (e) => {
    setError("");
    setUploadStatus("");
    setValidationErrors([]);

    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }
      setFile(inputFile);
    }
  };

  const validateCSV = async (data) => {
    const errors = [];
  
    // Obtenha todas as informações necessárias uma vez e armazene-as em um objeto temporário
    const productInfo = {};
  
    await Promise.all(
      data.map(async (row, index) => {
        const productCode = row.product_code;
        const newPrice = parseFloat(row.new_price);
  
        if (!(await productExists(productCode))) {
          errors.push(`Produto na linha ${index + 2}: Código do produto ${productCode} não existe.`);
        } else {
          // Verifique se as informações do produto já foram obtidas para evitar chamadas repetidas
          if (!productInfo[productCode]) {
            const currentPrice = await getCurrentPrice(productCode);
            const costPrice = await getCostPrice(productCode);
  
            productInfo[productCode] = {
              currentPrice,
              costPrice,
            };
          }
  
          const { currentPrice, costPrice } = productInfo[productCode];
  
          if (!isPriceInRange(newPrice, currentPrice)) {
            errors.push(
              `Produto na linha ${index + 2}: Novo preço ${newPrice} não está dentro da faixa permitida.`
            );
          }
  
          if (newPrice < costPrice) {
            errors.push(
              `Produto na linha ${index + 2}: Novo preço ${newPrice} é menor que o preço de custo ${costPrice}.`
            );
          }
  
          if (isNaN(newPrice) || newPrice <= 0) {
            errors.push(`Produto na linha ${index + 2}: Novo preço inválido.`);
          }
        }
      })
    );

    return errors;
  };

  const productExists = async (productCode) => {
    try {
      const response = await listProducts();
      const products = response.data;
      return products.some((product) => product.code === Number(productCode));
    } catch (error) {
      console.error("Erro ao verificar se o produto existe:", error);
      return false;
    }
  };

  const getCurrentPrice = async (productCode) => {
    try {
      const response = await byIdProduct(productCode);
      const product = response.data;
      const currentPrice = product.sales_price;
      console.log("Preço Atual:", currentPrice);
      return currentPrice;
    } catch (error) {
      console.error("Erro ao obter o preço atual do produto:", error);
      return 0;
    }
  };

  const getCostPrice = async (productCode) => {
    try {
      const response = await byIdProduct(productCode);
      const product = response.data;
      const costPrice = product.cost_price;
      console.log("Preço de Custo:", costPrice);
      return costPrice;
    } catch (error) {
      console.error("Erro ao obter o preço de custo do produto:", error);
      return 0;
    }
  };

  const isPriceInRange = (newPrice, currentPrice) => {
    const upperLimit = currentPrice * 1.1;
    const lowerLimit = currentPrice * 0.9;
    console.log("Preço Atual:", currentPrice);
    console.log("Limite Superior:", upperLimit);
    console.log("Limite Inferior:", lowerLimit);
    const isInRange = newPrice <= upperLimit && newPrice >= lowerLimit;
    console.log("Está no intervalo:", isInRange);
    return isInRange;
  };

  const handleValidate = async () => {
    if (!file) return setError("Enter a valid file");
  
    const reader = new FileReader();
  
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;

      console.log(parsedData)

      if (parsedData.length < 2) {
        setError("O arquivo CSV deve conter pelo menos duas linhas.");
        return;
      }

      const dataToProcess = parsedData.slice(1);
  
      const validationErrors = await validateCSV(parsedData); // Agora, espere pela validação assíncrona
  
      if (validationErrors.length === 0) {
        setData(dataToProcess);
        setUploadStatus("Arquivo validado com sucesso.");
        setCanUpdate(true);
      } else {
        setUploadStatus("Erros de validação encontrados.");
        setValidationErrors(validationErrors);
        setCanUpdate(false);
      }
    };
    reader.readAsText(file);
  };

  const handleUpdate = async () => {
    try {
      // Atualize o banco de dados para cada linha de dados no arquivo CSV
      for (const row of data) {
        const productCode = row.product_code;
        const newPrice = parseFloat(row.new_price);
  
        // Use a função updateProduct para atualizar o preço do produto no banco de dados
        await updateProduct({ sales_price: newPrice }, productCode);
      }
  
      setUploadStatus("Dados atualizados com sucesso no banco de dados!");
    } catch (error) {
      setUploadStatus("Erro ao atualizar o banco de dados.");
      console.error("Erro ao atualizar o banco de dados:", error);
    }
  };

  return (
    <div>
      <label htmlFor="csvInput" style={{ display: "block" }}>
        Enter CSV File
      </label>
      <input onChange={handleFileChange} id="csvInput" name="file" type="File" />
      <div>
        <button onClick={handleValidate}>Validar</button>
        <button onClick={handleUpdate} disabled={!canUpdate}>
          Atualizar
        </button>
      </div>
      <div style={{ marginTop: "3rem" }}>
        {error ? (
          error
        ) : (
          <div>
            {uploadStatus && <p>{uploadStatus}</p>}
            {validationErrors.length > 0 && (
              <div>
                <p>Erros de Validação:</p>
                <ul>
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.length > 0 && (
              <table>
                <thead></thead>
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((col, idx) => (
                      <th key={idx}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
