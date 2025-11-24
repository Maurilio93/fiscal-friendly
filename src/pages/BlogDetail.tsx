import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, ArrowLeft, Clock } from "lucide-react";

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

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento articolo...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😕</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Articolo non trovato</h1>
          <p className="text-muted-foreground mb-6">
            L'articolo che stai cercando potrebbe essere stato rimosso o non esiste.
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna al blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header con immagine */}
      {article.cover_image && (
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-muted">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      {/* Contenuto */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className={article.cover_image ? "-mt-20 relative z-10 mb-6" : "py-8"}>
            <Link to="/blog">
              <Button variant="outline" className="bg-background/95 backdrop-blur">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Torna al blog
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <article className={article.cover_image ? "relative z-10" : "py-8"}>
            <header className="mb-8 md:mb-12">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground border-l-4 border-primary pl-4 bg-muted/30 py-3 rounded-r">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {article.author_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">
                    Redazione Miniconsulenze
                  </span>
                </div>
                
                <span className="hidden sm:inline text-muted-foreground">•</span>
                
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.published_at)}
                </span>

                <span className="hidden sm:inline text-muted-foreground">•</span>

                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {article.views} letture
                </span>

                <span className="hidden sm:inline text-muted-foreground">•</span>

                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {estimateReadingTime(article.content)} min
                </span>
              </div>
            </header>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none
                         prose-headings:font-bold prose-headings:text-foreground
                         prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
                         prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                         prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6
                         prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                         prose-strong:text-foreground prose-strong:font-bold
                         prose-ul:my-6 prose-li:text-foreground prose-li:my-2
                         prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                         prose-blockquote:border-l-4 prose-blockquote:border-primary 
                         prose-blockquote:bg-muted/30 prose-blockquote:py-4 prose-blockquote:px-6
                         prose-blockquote:rounded-r prose-blockquote:not-italic
                         prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded
                         dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* CTA finale */}
            <div className="mt-16 p-8 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl border-2 border-primary/20 text-center">
              <h3 className="text-2xl font-bold mb-3">
                Hai bisogno di una consulenza?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                I nostri esperti sono pronti ad aiutarti con consulenze personalizzate su fisco, contabilità e gestione aziendale.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/servizi">
                  <Button size="lg" className="w-full sm:w-auto">
                    Scopri i servizi
                  </Button>
                </Link>
                <Link to="/contatti">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Contattaci
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}