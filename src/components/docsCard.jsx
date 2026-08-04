import "../styles/docs.css"
import ReactMarkdown from "react-markdown";
// import { useEffect } from "react";


function DocsCard({ isOpen, onClose, title, data }) {

    if (!isOpen) return null;
    let prettyTitle ;
    if (title === "readme"){
        prettyTitle = "README Markdown";
    }
    else if (title === "cvBullets"){
        prettyTitle = "CV Bullet Points ";
    }
    else if (title === "interviewPrep"){
        prettyTitle = "Interview Prep";
    }
    else if (title === "qaGuide"){
        prettyTitle = "Q&A Technical Guide";
    }

    const renderContent = () => {

        // README
        if (title === "readme") {
            return (
                <div className="markdown-body">
                    <ReactMarkdown>
                        {data}
                    </ReactMarkdown>
                </div>
            );
        }

        // CV Bullets
        if (title === "cvBullets") {
            return (
                <ul className="docs-list">
                    {data.map((bullet, index) => (
                        <li key={index}>{bullet}</li>
                    ))}
                </ul>
            );
        }

        // Interview Prep & Q&A
        if (title === "interviewPrep" || title === "qaGuide") {
            return (
                <div className="qa-container">
                    {data.map((item, index) => (
                        <div key={index} className="qa-card">
                            <h3 className="qa-question">
                                {index + 1}. {item.question}
                            </h3>

                            <p className="qa-answer">
                                {item.answer}
                            </p>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <pre>{JSON.stringify(data, null, 2)}</pre>
        );
    };

    // useEffect(() => {
    // if (isOpen) {
    //     document.body.style.overflow = "hidden";
    // } else {
    //     document.body.style.overflow = "auto";
    // }

    // // Cleanup in case the component unmounts
    // return () => {
    //     document.body.style.overflow = "auto";
    // };
    //     }, [isOpen]);


    return (
        <div className="docs-overlay">

            <div className="docs-card">

                <div className="docs-header">
                    <h2>{prettyTitle}</h2>

                    <button
                        className="docs-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="docs-body">
                    {renderContent()}
                </div>

            </div>

        </div>
    );
}

export default DocsCard;