import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Eye, ArrowRight } from "lucide-react";

const API_URL = "/api";

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image?: string;
  author_name: string;
  published_at: string;
  views: number;
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/blog/articles`);
      setArticles(data.articles);
    } catch (error) {
      console.error("Errore caricamento articoli:", error);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento articoli...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section - Stile identico a Contatti con fascia blu */}
      <section className="bg-[#1e3a5f] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Blog
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Scopri i nostri ultimi articoli su fisco, consulenza e normative
          </p>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Nessun articolo disponibile</h3>
                <p className="text-muted-foreground">
                  Torna presto per leggere i nostri ultimi aggiornamenti!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {articles.map((article) => (
                <Card 
                  key={article.id} 
                  className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50"
                >
                  {article.cover_image && (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {formatDate(article.published_at)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4" />
                        {article.views}
                      </span>
                    </div>
                    
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    
                    <CardDescription className="line-clamp-3 text-base">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Link to={`/blog/${article.slug}`}>
                      <Button 
                        variant="ghost" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                      >
                        Leggi tutto
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}