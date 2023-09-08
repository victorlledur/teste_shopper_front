import { useState } from "react";
import Papa from "papaparse";
import { byIdProduct, listProducts, updateProduct } from "../../services/mainApi/products";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { MainDiv, LabelButtonDiv, Tilte, Label, Input, Buttons, ValidationDiv, ResultsDiv } from "./styles";
import "./styles.css"

const allowedExtensions = ["csv"];

const Home = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [validationErrors, setValidationErrors] = useState([]);
    const [canUpdate, setCanUpdate] = useState(false);
    const [productInfoList, setProductInfoList] = useState([]);
    const handleFileChange = (e) => {
        setError("");
        setUploadStatus("");
        setValidationErrors([]);
        setProductInfoList([]);
        if (e.target.files.length) {
            const inputFile = e.target.files[0];
            const fileExtension = inputFile?.type.split("/")[1];
            if (!allowedExtensions.includes(fileExtension)) {
                setError("Por favor, escolha um arquivo CSV");
                return;
            }
            setFile(inputFile);
        }
    };
    const validateCSV = async (data) => {
        const errors = [];
        const productInfo = {};
        await Promise.all(
            data.map(async (row, index) => {
                const productCode = row.product_code;
                const newPrice = parseFloat(row.new_price);
                if (!(await productExists(productCode))) {
                    errors.push(`Produto na linha ${index + 2}: Código do produto ${productCode} não existe.`);
                    setProductInfoList((prevProductInfoList) => [
                        ...prevProductInfoList,
                        {
                            productCode,
                            productName: "N/A",
                            currentPrice: "N/A",
                            newPrice,
                        },
                    ]);
                } else {
                    if (!productInfo[productCode]) {
                        const currentPrice = await getCurrentPrice(productCode);
                        const costPrice = await getCostPrice(productCode);
                        const productNameResponse = await byIdProduct(productCode);
                        const productName = productNameResponse.data.name;
                        productInfo[productCode] = {
                            currentPrice,
                            costPrice,
                        };
                        setProductInfoList((prevProductInfoList) => [
                            ...prevProductInfoList,
                            {
                                productCode,
                                productName,
                                currentPrice,
                                newPrice,
                            },
                        ]);
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
            console.log(`Preço Atual (${productCode}): ${currentPrice}`);
            return currentPrice;
        } catch (error) {
            console.error(`Erro ao obter o preço atual do produto ${productCode}:`, error);
            return 0;
        }
    };
    const getCostPrice = async (productCode) => {
        try {
            const response = await byIdProduct(productCode);
            const product = response.data;
            const costPrice = product.cost_price;
            console.log(`Preço de Custo (${productCode}): ${costPrice}`);
            return costPrice;
        } catch (error) {
            console.error(`Erro ao obter o preço de custo do produto ${productCode}:`, error);
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
        if (!file) return setError("Escolha um arquivo valido");

        const reader = new FileReader();

        reader.onload = async ({ target }) => {
            try {
                const fileContent = target.result;
                if (!fileContent) {
                    setError("O arquivo está vazio.");
                    return;
                }
                const csvData: any = Papa.parse(fileContent.toString(), {
                    header: true,
                    skipEmptyLines: true,
                });
                if (csvData.errors.length > 0) {
                    console.error("Erros durante o parsing do arquivo CSV:", csvData.errors);
                    setError("Erro ao analisar o arquivo CSV.");
                    return;
                }
                if (!csvData.data || csvData.data.length < 1) {
                    setError("O arquivo CSV está vazio ou não possui dados válidos.");
                    return;
                }
                const validationErrors = await validateCSV(csvData.data);
                console.log("Erros de validação encontrados:", validationErrors);
                if (validationErrors.length === 0) {
                    setData(csvData.data);
                    setUploadStatus("Arquivo validado com sucesso.");
                    setCanUpdate(true);
                } else {
                    setUploadStatus("Erros de validação encontrados.");
                    setValidationErrors(validationErrors);
                    setCanUpdate(false);
                }
            } catch (error) {
                console.error("Erro ao analisar o arquivo CSV:", error);
                setError("Erro ao analisar o arquivo CSV.");
            }
        };
        reader.readAsText(file);
    };
    const handleUpdate = async () => {
        try {
            for (const row of data) {
                const productCode = row.product_code;
                let salesPrice = parseFloat(row.new_price);
                const req = {
                    sales_price: salesPrice,
                };
                console.log('JSON a ser enviado:', req);
                console.log(`Atualizando produto ${productCode} com preço ${salesPrice}`);
                await updateProduct(req, productCode);
            }
            setUploadStatus("Dados atualizados com sucesso no banco de dados!");
            console.log("Upload Status:", uploadStatus);
            setData([]);
            setError("");
            setFile(null);
            setUploadStatus("");
            setValidationErrors([]);
            setCanUpdate(false);
            setProductInfoList([]);
        } catch (error) {
            setUploadStatus("Erro ao atualizar o banco de dados.");
            console.error("Erro ao atualizar o banco de dados:", error);
        }
    };
    return (
        <div>
            <div>
                <Header></Header>
            </div>
            <MainDiv>
                <Tilte>Atualizador de Preços da Shopper</Tilte>
                <LabelButtonDiv>
                    <Label htmlFor="csvInput">
                        Arquivo CSV
                    </Label>
                    <Input onChange={handleFileChange} id="csvInput" name="file" type="File" />
                </LabelButtonDiv>
                <div>
                    <Buttons onClick={handleValidate}>Validar</Buttons>
                    <Buttons onClick={handleUpdate} disabled={!canUpdate}>
                        Atualizar
                    </Buttons>
                </div>
                <div>
                    {error ? (
                        error
                    ) : (
                        <ResultsDiv>
                            {uploadStatus && <p>{uploadStatus}</p>}
                            {validationErrors.length > 0 && (
                                <ValidationDiv>
                                    <p>Erros de Validação:</p>
                                    <ul>
                                        {validationErrors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </ValidationDiv>
                            )}
                            {productInfoList.length > 0 && (
                                <div>
                                    <p>Informações dos Produtos:</p>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className="conteudo">Código</th>
                                                <th className="conteudo">Nome</th>
                                                <th className="conteudo">Preço Atual</th>
                                                <th className="conteudo">Novo Preço</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productInfoList.map((productInfo, index) => (
                                                <tr key={index}>
                                                    <td>{productInfo.productCode}</td>
                                                    <td>{productInfo.productName}</td>
                                                    <td>{productInfo.currentPrice}</td>
                                                    <td>{productInfo.newPrice}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </ResultsDiv>
                    )}
                </div>
            </MainDiv>
            <Footer></Footer>
        </div>
    );
};

export default Home;