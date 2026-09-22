import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      message="The page you're looking for doesn't exist."
      action={
        <Link to="/" className="btn btn-primary">
          Back to dashboard
        </Link>
      }
    />
  );
}
