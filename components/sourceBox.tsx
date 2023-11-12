import React from 'react';

interface Payload {
  article: string;
  content: string;
  headings: string[];
  link: string;
  title: string;
}

interface Source {
  id: number;
  version: number;
  score: number;
  payload: Payload;
  vector: any; // Assuming vector can be any type, specify if it's not the case
}

interface SourceBoxProps {
  number: number;
  source: Source;
}

// Adapted SourceBox component to display data from the source
const SourceBox: React.FC<SourceBoxProps> = ({ number, source }) => (
  <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-start w-full border border-gray-700">
    <div className="text-gray-400 text-xs uppercase">{`Source ${number}`}</div>
    <h3 className="text-white text-sm font-semibold mt-1">{source.payload.title}</h3>
    <p className="text-gray-500 text-xs mt-1">{source.payload.content.substring(0, 150)}...</p>
    <a href={source.payload.link} className="text-blue-400 text-xs mt-2" target="_blank" rel="noopener noreferrer">Read more</a>
  </div>
);

interface SourcesSectionProps {
  sources?: Source[];
}

// Component for the sources section with Tailwind CSS to match the design
const SourcesSection: React.FC<SourcesSectionProps> = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return <div className="text-white">No sources available.</div>;
  }

  return (
    <section className="bg-black p-6 rounded-lg w-full">
      <h2 className="text-white text-lg font-bold mb-4">Sources</h2>
      <div className="grid grid-cols-1 gap-4">
        {sources.map((source, index) => (
          <SourceBox
            key={source.id}
            number={index + 1}
            source={source}
          />
        ))}
      </div>
    </section>
  );
};

export default SourcesSection;
