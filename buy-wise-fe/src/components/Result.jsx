import React from "react";
import "../styles/result.css";

const Result = ({
  answer = "",
  products = [],
  error = "",
  loading = false,
}) => {
  console.log({ "props results": { answer, products, error, loading } });
  return (
    <div className="result">
      <div className="result-cont">
        {loading ? (
          <p className="result-thinking">Thinking...</p>
        ) : (
          <div>
            {error ? (
              <p className="result-error">{error}</p>
            ) : (
              <div className="result-content">
                {answer && <p className="result-answer">{answer}</p>}
                {products && (
                  <div className="result-products">
                    {products?.map((product, index) => (
                      <div className="result-product" key={index}>
                        <img src={product?.image} alt={product?.title} />
                        <h3>{product?.title}</h3>
                        <a href={product?.url} target="_blank" rel="noreferrer">
                          Visit
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
