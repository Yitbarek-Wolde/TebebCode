import { useEffect, useState, ChangeEvent } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import Editor from '@monaco-editor/react';

interface Problem {
  id?: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  starterCode: { javascript: string };
  testCases: { input: string; output: string }[];
  solutionExplanation: string;
}

export default function ProblemListEditor() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    tags: '',
    starterCode: '',
    testCases: '',
    solutionExplanation: ''
  });

  useEffect(() => {
    async function fetchProblems() {
      const snapshot = await getDocs(collection(db, 'problems'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Problem));
      setProblems(data);
    }
    fetchProblems();
  }, []);

  async function handleSelectProblem(id: string) {
    const docRef = doc(db, 'problems', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Problem;
      setSelectedProblem({ id, ...data });
      setCode(data.starterCode?.javascript || '');
      setResult(null);
    }
  }

  async function handleRunCode() {
    const response = await fetch('http://localhost:4000/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        script: code,
        language: 'nodejs',
        versionIndex: '4'
      })
    });
    const output = await response.json();
    setResult(output);
  }

  async function handleUploadProblem() {
    const formatted: Problem = {
      title: newProblem.title,
      description: newProblem.description,
      difficulty: newProblem.difficulty,
      tags: newProblem.tags.split(',').map(tag => tag.trim()),
      starterCode: { javascript: newProblem.starterCode },
      testCases: JSON.parse(newProblem.testCases),
      solutionExplanation: newProblem.solutionExplanation
    };
    await addDoc(collection(db, 'problems'), formatted);
    alert('Problem added!');
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setNewProblem({ ...newProblem, [e.target.name]: e.target.value });
  }

  return (
    <div className="p-6 grid grid-cols-3 gap-6 bg-gray-50 min-h-screen">
      <div className="col-span-1 bg-white p-4 rounded-xl shadow">
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={adminMode} onChange={() => setAdminMode(!adminMode)} />
            <span className="text-sm">Admin Mode</span>
          </label>
        </div>
        {!adminMode ? (
          <>
            <h2 className="text-xl font-bold mb-3">Problems</h2>
            <ul className="space-y-2">
              {problems.map((p) => (
                <li key={p.id}>
                  <button className="text-blue-600 hover:underline text-left" onClick={() => handleSelectProblem(p.id!)}>
                    {p.title}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-3">Add New Problem</h2>
            <div className="space-y-2">
              <input className="w-full p-2 border rounded" name="title" placeholder="Title" onChange={handleChange} />
              <textarea className="w-full p-2 border rounded" name="description" placeholder="Description" onChange={handleChange} />
              <input className="w-full p-2 border rounded" name="difficulty" placeholder="Difficulty" onChange={handleChange} />
              <input className="w-full p-2 border rounded" name="tags" placeholder="Tags (comma-separated)" onChange={handleChange} />
              <textarea className="w-full p-2 border rounded" name="starterCode" placeholder="Starter Code (JavaScript)" onChange={handleChange} />
              <textarea className="w-full p-2 border rounded" name="testCases" placeholder='Test Cases (JSON array e.g. [{"input": "1 2", "output": "3"}])' onChange={handleChange} />
              <textarea className="w-full p-2 border rounded" name="solutionExplanation" placeholder="Solution Explanation" onChange={handleChange} />
              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleUploadProblem}>Upload</button>
            </div>
          </div>
        )}
      </div>

      <div className="col-span-2 bg-white p-6 rounded-xl shadow">
        {selectedProblem && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{selectedProblem.title}</h2>
              <p className="text-gray-700 mt-2 whitespace-pre-line">{selectedProblem.description}</p>
            </div>
            <Editor
              height="350px"
              defaultLanguage="javascript"
              value={code}
              onChange={(value:any) => setCode(value || '')}
            />
            <button className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleRunCode}>
              Run Code
            </button>
            {result && (
              <div>
                <h3 className="font-semibold text-lg">Output:</h3>
                <pre className="bg-gray-800 text-green-200 p-4 rounded-xl max-h-[500px] overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
