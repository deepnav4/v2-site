import { Link } from 'react-router-dom';
import { allTags } from '../data/blogPosts';

export default function Tags() {
  return (
    <div className="container py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">Tags</h1>
        <p className="text-xl text-gray-600">
          Explore articles by topic
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allTags.map(tag => (
          <Link
            key={tag}
            to={`/tags/${tag}`}
            className="card hover:shadow-sm text-center"
          >
            <h3 className="font-medium text-gray-900">{tag}</h3>
            <p className="text-sm text-gray-500 mt-2">View posts</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
