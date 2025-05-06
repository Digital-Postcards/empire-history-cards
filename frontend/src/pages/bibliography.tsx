import React from "react";
import { ContentContainer } from "components/common";
import { BIBLIOGRAPHY_CONTENT } from "utils/constants";

const Bibliography = () => {
    return (
        <ContentContainer>
            <h1 className="text-3xl font-bold mb-8">Bibliography</h1>
            <p className="text-lg mb-8">
                This bibliography contains resources referenced in the study of postcards and tradecards related to
                domestic workers in the age of New Imperialism, Jim Crow segregation, and Asian Exclusion.
            </p>

            {BIBLIOGRAPHY_CONTENT.sections.map((section, index) => (
                <div className="mb-10" key={index}>
                    <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        {section.resources.map((resource, resIndex) => (
                            <li key={resIndex} className="text-lg">
                                {resource.startsWith("http") ? (
                                    <a
                                        href={resource}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline">
                                        {resource}
                                    </a>
                                ) : (
                                    resource
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </ContentContainer>
    );
};

export default Bibliography;
