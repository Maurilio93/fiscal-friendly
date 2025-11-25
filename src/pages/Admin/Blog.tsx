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
import { Plus, Edit, Trash2, Eye, Upload, X, Image as ImageIcon } from "lucide-react";

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
  const [uploading, setUploading] = useState(false);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Controlla dimensione (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'immagine è troppo grande (max 5MB)");
      return;
    }

    // Controlla tipo
    if (!file.type.startsWith("image/")) {
      toast.error("Carica solo immagini");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(`${API_URL}/admin/blog/upload-image`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      setCoverImage(data.fullUrl);
      toast.success("Immagine caricata!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Errore nel caricamento");
    } finally {
      setUploading(false);
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
        await axios.put(
          `${API_URL}/admin/blog/articles/${editingId}`,
          { title, content, coverImage, published },
          { withCredentials: true }
        );
        toast.success("Articolo aggiornato!");
      } else {
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
              
              {/* NUOVO BOX UPLOAD IMMAGINE */}
              <div>
                <Label>Immagine di copertina</Label>
                
                <div className="space-y-3 mt-2">
                  {!coverImage ? (
                    // Box con + per caricare
                    <div
                      onClick={() => document.getElementById("imageFile")?.click()}
                      className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer group"
                    >
                      <input
                        id="imageFile"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      
                      <div className="flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          {uploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          ) : (
                            <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </div>
                        
                        <div>
                          <p className="font-medium text-sm">
                            {uploading ? "Caricamento..." : "Carica immagine di copertina"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            JPG, PNG, WEBP o GIF (max 5MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Preview con immagine
                    <div className="relative group">
                      <img 
                        src={coverImage} 
                        alt="Preview" 
                        className="w-full h-64 object-cover rounded-lg border-2"
                        onError={() => toast.error("Immagine non valida")}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setCoverImage("")}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rimuovi
                      </Button>
                    </div>
                  )}
                  
                  {/* Input URL opzionale */}
                  <div className="flex gap-2 items-center">
                    <Input
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="oppure incolla un URL immagine"
                      className="flex-1"
                    />
                  </div>
                </div>
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
                  disabled={saving || uploading}
                  className="flex-1"
                >
                  {saving ? "Salvataggio..." : "Salva Articolo"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  disabled={saving || uploading}
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
                  <div className="flex gap-4 flex-1">
                    {article.cover_image && (
                      <img 
                        src={article.cover_image} 
                        alt={article.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
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