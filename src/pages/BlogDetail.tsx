import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, ArrowLeft } from "lucide-react";

const API_URL = "/api";

interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  cover_image?: string;
  author_name: string;
  published_at: string;
  views: number;
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(false);
      const { data } = await axios.get(`${API_URL}/blog/articles/${slug}`);
      setArticle(data);
    } catch (err) {
      console.error("Errore caricamento articolo:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Caricamento...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Articolo non trovato</h1>
        <Link to="/blog">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna al blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/blog" className="inline-block mb-6">
        <Button variant="ghost">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna al blog
        </Button>
      </Link>

      <article className="max-w-4xl mx-auto">
        {/* Cover Image */}
        {article.cover_image && (
          <div className="aspect-video rounded-lg overflow-hidden mb-8">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <span className="font-medium">Di {article.author_name}</span>
            
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(article.published_at)}
            </span>

            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.views} visualizzazioni
            </span>
          </div>
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none dark:prose-invert
                     prose-headings:font-bold prose-a:text-primary
                     prose-img:rounded-lg prose-img:shadow-md
                     prose-p:text-foreground prose-li:text-foreground"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  );
}