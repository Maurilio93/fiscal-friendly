import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

const API_URL = "/api";

interface Article {
  id: number;
  slug: string;
  title: string;
  content?: string;
  cover_image?: string;
  published: boolean;
  published_at: string;
  views: number;
  created_at: string;
}

export default function AdminBlog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/admin/blog/articles`, {
        withCredentials: true
      });
      setArticles(data.articles);
    } catch (error) {
      toast.error("Errore nel caricamento degli articoli");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openNewDialog = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setCoverImage("");
    setPublished(true);
    setDialogOpen(true);
  };

  const openEditDialog = async (id: number) => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/blog/articles/${id}`, {
        withCredentials: true
      });
      setEditingId(id);
      setTitle(data.title);
      setContent(data.content || "");
      setCoverImage(data.cover_image || "");
      setPublished(Boolean(data.published));
      setDialogOpen(true);
    } catch (error) {
      toast.error("Errore nel caricamento dell'articolo");
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Titolo e contenuto sono obbligatori");
      return;
    }

    try {
      setSaving(true);
      
      if (editingId) {
        // Modifica
        await axios.put(
          `${API_URL}/admin/blog/articles/${editingId}`,
          { title, content, coverImage, published },
          { withCredentials: true }
        );
        toast.success("Articolo aggiornato!");
      } else {
        // Nuovo
        await axios.post(
          `${API_URL}/admin/blog/articles`,
          { title, content, coverImage, published },
          { withCredentials: true }
        );
        toast.success("Articolo creato!");
      }
      
      setDialogOpen(false);
      loadArticles();
    } catch (error) {
      toast.error("Errore nel salvataggio");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Sei sicuro di voler eliminare "${title}"?`)) return;

    try {
      await axios.delete(`${API_URL}/admin/blog/articles/${id}`, {
        withCredentials: true
      });
      toast.success("Articolo eliminato");
      loadArticles();
    } catch (error) {
      toast.error("Errore nell'eliminazione");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestione Blog</h1>
          <p className="text-muted-foreground mt-1">
            Crea e gestisci gli articoli del blog
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Articolo
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Modifica Articolo" : "Nuovo Articolo"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Titolo *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Inserisci il titolo"
                />
              </div>
              
              <div>
                <Label htmlFor="coverImage">Immagine di copertina (URL)</Label>
                <Input
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://esempio.com/immagine.jpg"
                />
                {coverImage && (
                  <img 
                    src={coverImage} 
                    alt="Preview" 
                    className="mt-2 w-full max-h-48 object-cover rounded-lg"
                  />
                )}
              </div>
              
              <div>
                <Label htmlFor="content">Contenuto * (HTML supportato)</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Scrivi il contenuto dell'articolo..."
                  rows={15}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Puoi usare HTML: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;a&gt;, &lt;img&gt;, ecc.
                </p>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="published">Pubblica subito</Label>
                  <p className="text-sm text-muted-foreground">
                    L'articolo sarà visibile nel blog pubblico
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? "Salvataggio..." : "Salva Articolo"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                >
                  Annulla
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista Articoli */}
      {articles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              Nessun articolo. Creane uno nuovo!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      {article.published ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          <Eye className="h-3 w-3" />
                          Pubblicato
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                          Bozza
                        </span>
                      )}
                    </div>
                    
                    <CardDescription>
                      <div className="flex gap-4 text-sm">
                        <span>Slug: {article.slug}</span>
                        <span>👁 {article.views} visualizzazioni</span>
                        <span>
                          {new Date(article.published_at || article.created_at).toLocaleDateString("it-IT")}
                        </span>
                      </div>
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(article.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(article.id, article.title)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}